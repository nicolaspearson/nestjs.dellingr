import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { TransactionState } from '../../common/enum/transaction-state.enum';
import { TransactionType } from '../../common/enum/transaction-type.enum';
import Wallet from './wallet.entity';

@Entity({ name: 'transaction' })
export default class Transaction {
  @PrimaryGeneratedColumn('uuid')
  uuid!: Uuid;

  @Column({ type: 'numeric', default: 0 })
  amount!: number;

  @Column('varchar', { name: 'reference' })
  reference!: string;

  @Column('enum', { enum: TransactionState })
  @Index('IDX_TX_STATE')
  state!: TransactionState;

  @Column('enum', { enum: TransactionType })
  @Index('IDX_TX_TYPE')
  type!: TransactionType;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true, type: 'timestamp with time zone' })
  updatedAt?: Date;

  @ManyToOne((_) => Wallet, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'wallet_uuid' })
  @Index('IDX_TRANSACTION_WALLET_UUID')
  wallet!: Wallet;
}
