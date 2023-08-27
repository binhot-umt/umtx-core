import { Prop, Schema } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { BaseSchema } from 'src/utils/base.schema';
import { v4 as uuidv4 } from 'uuid';
import { Types } from 'mongoose';

export class ClassDateRoom {
  @Prop({ required: true, default: '-', select: true })
  ses_roomid: string;

  @Prop({ required: true, default: '-', select: true })
  ses_room: string;

  @Prop({ required: true, default: '-', select: true })
  ses_roomname: string;

  @Prop({ required: true, default: 0, select: true })
  ses_roomtype: number;

  @Prop({ required: true, default: 0, select: true })
  ses_roomcapacity: number;

  @Prop({ required: true, default: '-', select: true })
  ses_campusname: string;

  @Prop({ required: true, default: '-', select: true })
  ses_campusnameen: string;

  @Prop({ required: true, default: '-', select: true })
  ses_schoolname: string;

  @Prop({ required: true, default: '-', select: true })
  ses_schoolnameen: string;

  @Prop({ required: true, default: '-', select: true })
  ses_locationname: string;

  @Prop({ required: true, default: null, select: true })
  ses_locationnameen: string | null;
}
export class SingleSES {
  @Prop({ required: true, default: '-', select: true })
  ses_classdateid: string;

  @Prop({ required: true, default: 0, select: true })
  ses_classtype: number;

  @Prop({ required: true, default: '-', select: true })
  ses_start: string;

  @Prop({ required: true, default: '-', select: true })
  ses_stop: string;

  @Prop({ required: true, default: '-', select: true })
  ses_actualtraininghours: string;

  @Prop({ required: true, default: '-', select: true })
  ses_roomid: string;

  @Prop({ required: true, default: '-', select: true })
  ses_room: string;

  @Prop({ required: true, default: '-', select: true })
  ses_roomname: string;

  @Prop({ required: true, default: '-', select: true })
  ses_facultyid: string;

  @Prop({ required: true, default: '-', select: true })
  ses_faculty: string;

  @Prop({ required: true, default: '-', select: true })
  ses_facultyname: string;

  @Prop({ required: true, default: 1, select: true })
  statuscode: number;

  @Prop({ required: true, default: {}, select: true })
  @ValidateNested({ each: true })
  @Type(() => ClassDateRoom)
  classdateroom: ClassDateRoom;
  @Prop({ required: true, default: '-', select: true })
  ses_coursenameen: string;
  @Prop({ required: true, default: '-', select: true })
  ses_institutionclassid: string;
}
export class SingleExam {
  @Prop({ required: true, default: null, select: true })
  ses_coursenameen: string | null;

  @Prop({ required: true, default: null, select: true })
  ses_examname: string | null;

  @Prop({ required: true, default: null, select: true })
  ses_locationname: string | null;

  @Prop({ required: true, default: null, select: true })
  ses_roomname: string | null;

  @Prop({ required: true, default: null, select: true })
  ses_examstartdate: Date | null;

  @Prop({ required: true, default: null, select: true })
  ses_examenddate: Date | null;
}
@Schema()
export class Course extends BaseSchema {
  @Prop({ required: true, default: () => uuidv4() })
  suid: string;

  @Prop({ required: true, default: () => uuidv4 })
  sercetKey: string;

  @Prop({ type: Types.ObjectId, ref: 'Users' })
  users?: string;

  @Prop({ required: true, default: null, select: true })
  @ValidateNested({ each: true })
  @Type(() => SingleSES)
  courses: SingleSES[] | null;

  @Prop({ required: true, default: null, select: true })
  @ValidateNested({ each: true })
  @Type(() => SingleExam)
  exams: SingleExam[] | null;
}
