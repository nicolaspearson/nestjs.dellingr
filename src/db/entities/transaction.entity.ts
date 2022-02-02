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

import { TransactionState } from '../../common/enum/transaction-state.enum';
import { TransactionType } from '../../common/enum/transaction-type.enum';
import Document from './document.entity';
import Wallet from './wallet.entity';

@Entity({ name: 'transaction' })
export default class Transaction implements Api.Entities.Transaction {
  @PrimaryGeneratedColumn('uuid')
  uuid!: Uuid;

  @Column({ type: 'numeric', default: 0 })
  amount!: number;

  @Column()
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

  @OneToMany(() => Document, (document) => document.transaction)
  documents!: Document[];

  @ManyToOne((_) => Wallet, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'wallet_uuid' })
  @Index('IDX_TRANSACTION_WALLET_UUID')
  wallet!: Wallet;

  @AfterLoad()
  @AfterInsert()
  @AfterUpdate()
  setDefaults() {
    if (!this.documents) {
      this.documents = [];
    }
  }
}
