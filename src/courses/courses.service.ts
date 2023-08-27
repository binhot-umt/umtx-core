import { Injectable } from '@nestjs/common';
import { ClassDateRoom, SingleExam, SingleSES } from './entities/course.entity';
import { CourseDocument } from './schemas/course.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UtilsService } from 'src/utils/utils.service';
import { MapiService } from 'src/utils/master-api/mapi.service';
import ical from 'ical-generator';

@Injectable()
export class CoursesService {
  constructor(
    @InjectModel('Courses') private readonly CourseModel: Model<CourseDocument>,
    private readonly utilsService: UtilsService,
    private readonly mapi: MapiService,
  ) {}
  getSyncURL(): string {
    return process.env.SYNC_SERVER_URL;
  }
  async createMass(suid, courses?: SingleSES[], exams?: SingleExam[]) {
    const key = this.utilsService.randomToken(7);
    const newCourse = new this.CourseModel({
      suid: suid,
      sercetKey: key,
      courses: courses,
      exams: exams,
    });
    const result = await newCourse.save();
    if (result) {
      return { message: 'Created', key: key, suid: suid };
    } else {
      return { message: 'Failed', key: null, suid: null };
    }
  }

  updateMass(uid: string, courses?: SingleSES[], exams?: SingleExam[]) {
    let updateEntity = {};
    if (courses) {
      updateEntity = { ...updateEntity, courses: courses };
    }
    if (exams) {
      updateEntity = { ...updateEntity, exams: exams };
    }
    return this.CourseModel.updateOne({ suid: uid }, updateEntity);
  }

  async find_me(uid, token?: any) {
    if ((await this.CourseModel.count({ suid: uid }).exec()) == 0) {
      // console.log('uid, token', uid, token);
      await this.fetch_calendar(uid, token);
    }
    const findMe = await this.CourseModel.findOne({ suid: uid }).exec();
    console.log('findMe', findMe);
    return {
      ...findMe['_doc'],
      url: this.getSyncURL() + '/courses/ic?s=' + findMe.sercetKey,
    };
  }
  async fetch_calendar(uid, token) {
    const total_course = [];
    const year = await this.mapi.getYear(token);

    for (const item of year) {
      const sem = await this.mapi.getSem(token, item.academicyearid);

      for (const item_sem of sem) {
        const schedule = await this.mapi.getSchedule(
          token,
          uid,
          item_sem.ses_termid,
        );

        for (const item_schedule of schedule) {
          for (const item_session of item_schedule.sessionclass
            .classclassdate) {
            total_course.push({
              ...item_session,
              ses_coursenameen: item_schedule.sessionclass.ses_coursenameen,
              ses_institutionclassid:
                item_schedule.sessionclass.ses_institutionclassid,
            });
          }
        }
      }
    }
    if ((await this.CourseModel.count({ suid: uid })) == 0) {
      await this.createMass(uid, total_course);
    } else {
      await this.updateMass(uid, total_course);
    }
    return total_course;
  }
  async fetch_exam(uid, token) {
    const total_exam = <SingleExam[]>[];
    const year = await this.mapi.getYear(token);

    for (const item of year) {
      const sem = await this.mapi.getSem(token, item.academicyearid);

      for (const item_sem of sem) {
        const schedule = await this.mapi.getExam(
          token,
          uid,
          item_sem.ses_termid,
        );

        for (const item_schedule of schedule) {
          total_exam.push(<SingleExam>{
            ses_coursenameen: item_schedule.ses_coursenameen,
            ses_examname: item_schedule.ses_examname,
            ses_locationname: item_schedule.ses_locationname,
            ses_roomname: item_schedule.ses_roomname,
            ses_examstartdate: new Date(item_schedule.ses_examstartdate),
            ses_examenddate: new Date(item_schedule.ses_examenddate),
          });
        }
      }
    }
    if ((await this.CourseModel.count({ suid: uid })) == 0) {
      await this.createMass(uid, null, total_exam);
    } else {
      await this.updateMass(uid, null, total_exam);
    }
    return total_exam;
  }

  async ical(token: string, res: any) {
    const list = await this.CourseModel.findOne({ sercetKey: token })
      .populate('users')
      .exec();

    const calendar = ical({ name: 'UMT Calendar' })
      .url(this.getSyncURL() + '/courses/ic?s=' + token)
      .ttl(60);

    list.courses.forEach((item) => {
      if (item.classdateroom == null) {
        item.classdateroom = new ClassDateRoom();
      }

      calendar.createEvent({
        start: item.ses_start,
        end: item.ses_stop,
        summary: item.ses_coursenameen,
        description:
          item.ses_coursenameen +
          '\n' +
          item.ses_facultyname +
          '\nRoom: ' +
          item.classdateroom.ses_roomname +
          '\nID: ' +
          item.ses_institutionclassid,
        location: `${item.classdateroom.ses_roomname} - ${item.classdateroom.ses_locationname}`,
      });
    });
    calendar.serve(res);
  }
}
