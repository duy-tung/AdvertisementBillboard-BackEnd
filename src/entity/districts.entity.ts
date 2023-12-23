import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Wards } from './wards.entity';
import { Spaces } from './spaces.entity';
import { RequestEditSpace } from './requestEditSpace.entity';

@Entity({ name: 'districts' })
export class Districts {
  @PrimaryGeneratedColumn({
    type: 'smallint',
    name: 'id',
    unsigned: true,
  })
  id: number;

  @Column({
    type: 'varchar',
    length: 255,
    name: 'name',
  })
  name: string;

  

  @OneToMany(() => Wards, ward => ward.district)
  wards: Wards[];

  @OneToMany(() => Spaces, space => space.district)
  spaces: Spaces[];

  @OneToMany(() => RequestEditSpace, space => space.district)
  requestEditSpaces: RequestEditSpace[];




  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'last_update', type: 'timestamp' })
  lastUpdate: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date;

}
