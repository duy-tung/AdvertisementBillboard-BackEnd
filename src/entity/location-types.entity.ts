import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Spaces } from './spaces.entity';
import { PendingSpace } from './pendingEditSpace.entity';
import { RequestEditSpace } from './requestEditSpace.entity';

@Entity({ name: 'location_types' })
export class LocationTypes {
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

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'last_update', type: 'timestamp' })
  lastUpdate: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date;

  //? KHÔNG NẰM TRONG DATABASE

  @OneToMany(() => Spaces, space => space.locationTypes)
  spaces: Spaces[];
  @OneToMany(() => RequestEditSpace, space => space.locationTypes)
  requestEditSpaces: RequestEditSpace[];


}
