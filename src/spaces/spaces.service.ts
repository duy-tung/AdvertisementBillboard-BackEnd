import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Spaces } from 'src/entity/spaces.entity';
import { Repository } from 'typeorm';
import { Pagination } from './dto/pagination';
import { CreateSpaceDto } from './dto/create-space.dto';
import { UpdateSpaceDto } from './dto/update-space.dto';
import { removeFile } from 'src/common/multer/config';
import { ReverseGeocodingService } from 'src/reverse-geocoding/reverse-geocoding.service';

@Injectable()
export class SpacesService {
  constructor(
    @InjectRepository(Spaces)
    private spacesRepository: Repository<Spaces>,
    private readonly rere: ReverseGeocodingService,

  ) {}

  async reverseGeocoding(lat: number, long: number) {
    const dataGeocoding = await this.rere.reverseGeocoding(lat, long);
    console.log(dataGeocoding);
    return dataGeocoding;
  }

  async findAll(pagination: Pagination) {
    // Giới hạn 1 page bao nhiêu item
    const limit = Number(pagination.limit) || 10;
    // Số page hiện tại
    const page = Number(pagination.page) || 1;
    // Tính skip bao nhiêu item
    const skip = (page - 1) * limit;

    const [data, total] = await this.spacesRepository.findAndCount({
      relations: {
        formAdvertising: true,
        locationTypes: true,
      },
      take: limit,
      skip: skip,
    });

    // Tính số page cuối cùng
    const lastPage = Math.ceil(total / limit);
    // Tính next page
    const nextPage = page + 1 > lastPage ? null : page + 1;
    // Tính prev page
    const prevPage = page - 1 < 1 ? null : page - 1;

    return {
      data,
      pagination: {
        totalPage: total,
        currentPage: page,
        lastPage,
        nextPage,
        prevPage,
      },
    };
  }

  //Find by (lat, long)
  async findByLatLong(lat: number, long: number) {
    return await this.spacesRepository.find({
      where: {
        latitude: lat,
        longitude: long,
      },
      relations: {
        formAdvertising: true,
        locationTypes: true,
      },
    });
  }

  //Find by id
  async findById(id: number) {
    return await this.spacesRepository.findOne({
      where: {
        id: id,
      },
      relations: {
        formAdvertising: true,
        locationTypes: true,
      },
    });
  }

  //Create new space
  async createSpace(data: CreateSpaceDto) {
    try {
      // const dataGeocoding = await this.reverseGeocoding(lat, long);
      // const data1 = {...data, ...dataGeocoding};
      // console.log(data1);
      const space = await this.spacesRepository.create(data);
      return await this.spacesRepository.save(space);
    } catch (error) {
      throw error;
    }
  }

  //Update space
  async updateSpace(id: number, data: UpdateSpaceDto) {
    try {
      let space = await this.findById(id);
      if (!space) {
        throw new Error('Space not found');
      }
      removeFile(space.imgUrl);
      space = { ...space, ...data };
      return await this.spacesRepository.save(space);
    } catch (error) {
      throw error;
    }
  }

  //Soft Delete space (Remove)
  async removeSpace(id: number) {
    try {
      let space = await this.findById(id);
      if (!space) {
        throw new Error('Space not found');
      }
      return await this.spacesRepository.softDelete(id);
    } catch (error) {
      throw error;
    }
  }

  //Restore space
  async restoreSpace(id: number) {
    try {
      return await this.spacesRepository.restore(id);
    } catch (error) {
      throw error;
    }
  }
}
