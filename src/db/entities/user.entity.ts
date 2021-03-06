import {
  AfterInsert,
  AfterLoad,
  AfterUpdate,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Wallet } from './wallet.entity';

@Entity({ name: 'user' })
export class User implements Api.Entities.User {
  @PrimaryGeneratedColumn('uuid')
  uuid!: Uuid;

  @Column({ type: 'varchar', unique: true })
  @Index('IDX_USER_EMAIL')
  email!: Email;

  @Column({ select: false })
  password!: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true, type: 'timestamp with time zone' })
  updatedAt?: Date;

  @OneToMany(() => Wallet, (wallet) => wallet.user)
  wallets!: Wallet[];

  @AfterLoad()
  @AfterInsert()
  @AfterUpdate()
  setDefaults(): void {
    this.wallets = this.wallets || [];
  }
}
