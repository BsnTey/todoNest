import { ClassConstructor, plainToInstance } from 'class-transformer';
import { Model } from 'sequelize-typescript';

const options = {
  excludeExtraneousValues: true,
};

export function convertModelToDto<T, V extends Model>(
  clsDto: ClassConstructor<T>,
  data: V,
): T;
export function convertModelToDto<T, V extends Model>(
  clsDto: ClassConstructor<T>,
  data: V[],
): T[];
export function convertModelToDto<T, V extends Model>(
  clsDto: ClassConstructor<T>,
  data: V | V[],
): T | T[] {
  if (Array.isArray(data)) {
    const plainArray = data.map((item) =>
      item instanceof Model ? item.get({ plain: true }) : item,
    );
    return plainToInstance(clsDto, plainArray, options);
  }
  const plain = data instanceof Model ? data.get({ plain: true }) : data;
  return plainToInstance(clsDto, plain, options);
}
