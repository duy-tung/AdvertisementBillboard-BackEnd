import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Surfaces } from 'src/entity/surfaces.entity';
import { Repository } from 'typeorm';
import { CreateSurfaceDto } from './dto/create-surface.dto';
import { UpdateSurfaceDto } from './dto/update-surface.dto';
import { removeFile } from 'src/common/multer/config';
import { PaginationSurface } from './dto/pagination';

@Injectable()
export class SurfacesService {
  constructor(
    @InjectRepository(Surfaces)
    private surfacesRepository: Repository<Surfaces>,
  ) {}

  

  //Find all surfaces
  async findAll() {
    return this.surfacesRepository.find({
      relations: {
        space: true,
        surfaceType: true,
      },
    });
  }

  //Find all by area
  async findAllByArea(pagination: PaginationSurface) {
    console.log(pagination);
    const ward = pagination.ward;
    const district = pagination.district;

    return this.surfacesRepository.find({
      where: {
        space: {
          district: { id: district },
          ward: { id: ward },
        },
      },
      relations: ['space', 'surfaceType'],
    });
  }

  //Find all surfaces by space id
  async findAllBySpaceId(spaceId: number) {
    return this.surfacesRepository.find({
      where: {
        space: { id: spaceId },
      },
      relations: {
        space: true,
        surfaceType: true,
      },
    });
  }

  //Find by id
  async findById(id: number) {
    return this.surfacesRepository.findOne({
      where: {
        id: id,
      },
      relations: {
        space: true,
        surfaceType: true,
      },
    });
  }

  //Create a new surface
  async createSurface(data: CreateSurfaceDto) {
    try {
      const surface = await this.surfacesRepository.create(data);
      return await this.surfacesRepository.save(surface);
    } catch (error) {
      throw error;
    }
  }

  //Update a surface
  async updateSurface(id: number, data: UpdateSurfaceDto) {
    try {
      let surface = await this.findById(id);
      if (!surface) {
        throw new Error('Surface not found');
      }
      removeFile(surface.imgUrl);
      surface = { ...surface, ...data };
      return await this.surfacesRepository.save(surface);
    } catch (error) {
      throw error;
    }
  }

  //Soft Delete a surface (Remove)
  async removeSurface(id: number) {
    try {
      const surface = await this.findById(id);
      if (!surface) {
        throw new Error('Surface not found');
      }
      return await this.surfacesRepository.softDelete(id);
    } catch (error) {
      throw error;
    }
  }

  //Restore a surface
  async restoreSurface(id: number) {
    try {
      return await this.surfacesRepository.restore(id);
    } catch (error) {
      throw error;
    }
  }
}
