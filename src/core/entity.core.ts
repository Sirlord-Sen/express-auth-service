import {
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    BeforeUpdate,
  } from 'typeorm';
  
  export default class EntityCore<T> {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @CreateDateColumn({ type: 'timestamptz' })
    createdAt!: Date;
  
    @UpdateDateColumn({ type: 'timestamptz' })
    updatedAt!: Date;
  
    constructor(input?: Partial<T>) {
      if (input) {
        Object.assign(this, input);
      }
    }
  
    @BeforeUpdate()
    updateDate() {
      this.updatedAt = new Date();
    }
  }