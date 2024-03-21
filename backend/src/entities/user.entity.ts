import * as argon2 from "argon2";
import { Column, Entity, PrimaryGeneratedColumn, BeforeInsert} from "typeorm";
import { Field, ObjectType, InputType } from "type-graphql";

@ObjectType()
@Entity()

export default class User {
  @BeforeInsert()
  protected async hashPassword() {
    this.password = await argon2.hash(this.password);
  }

  @Field()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column({unique: true})
  email: string;

  @Field()
  @Column()
  password: string;
}

@ObjectType()
export class UserWithoutPassword implements Omit<User, "password"> {
  @Field()
  id: string;

  @Field()
  email: string;
}

@InputType()
export class InputRegister {
  @Field()
  email: string;
  
  @Field()
  password: string
}

@ObjectType()
export class Message {
  @Field()
  success: boolean;

  @Field()
  message: string;
}

@InputType()
export class InputLogin {
  @Field()
  email: string;

  @Field()
  password: string;
}