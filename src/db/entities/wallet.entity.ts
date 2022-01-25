import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import Transaction from '$/db/entities/transaction.entity';
import User from '$/db/entities/user.entity';

@Entity({ name: 'wallet' })
export default class Wallet {
  @PrimaryGeneratedColumn('uuid')
  uuid!: Uuid;

  @Column({ default: 0 })
  balance!: number;

  @Column({ nullable: false })
  name!: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true, type: 'timestamp with time zone' })
  updatedAt?: Date;

  @OneToMany(() => Transaction, (transaction) => transaction.wallet)
  transactions!: Transaction[];

  @OneToOne((_) => User, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'user_uuid' })
  @Index('IDX_WALLET_USER_UUID', { unique: true })
  user!: User;
}
