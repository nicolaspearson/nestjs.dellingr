import {
  AfterInsert,
  AfterLoad,
  AfterUpdate,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Transaction } from './transaction.entity';
import { User } from './user.entity';

@Entity({ name: 'wallet' })
export class Wallet implements Api.Entities.Wallet {
  @PrimaryGeneratedColumn('uuid')
  uuid!: Uuid;

  @Column({ default: 0 })
  balance!: number;

  @Column()
  name!: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true, type: 'timestamp with time zone' })
  updatedAt?: Date;

  @OneToMany(() => Transaction, (transaction) => transaction.wallet)
  transactions!: Transaction[];

  @ManyToOne((_) => User, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'user_uuid' })
  @Index('IDX_WALLET_USER_UUID')
  user!: User;

  @AfterLoad()
  @AfterInsert()
  @AfterUpdate()
  setDefaults(): void {
    this.transactions = this.transactions || [];
  }
}
