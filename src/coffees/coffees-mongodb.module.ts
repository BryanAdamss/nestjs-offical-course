// coffees.service.ts

@Injectable()
export class CoffeesService {
  constructor(
    @InjectModel(Coffee.name) private readonly coffeeModel: Model<Coffee>,
  ) {}

  findAll() {
    /** 通过exec()执行查询 */
    return this.coffeeModel.find().exec();
  }

  findOne(id: string) {
    return this.coffeeModel.findOne({ _id: id }).exec();
  }

  create(createCoffeeDto: any) {
    const coffee = new this.coffeeModel(createCoffeeDto);
    return coffee.save();
  }

  async update(id: string, updateCoffeeDto: any) {
    const existingCoffee = await this.coffeeModel
      .findOneAndUpdate({ _id: id }, { $set: updateCoffeeDto }, { new: true })
      .exec();

    if (!existingCoffee) throw new Error('not found');

    return existingCoffee;
  }

  async remove(id: string) {
    const coffee = await this.findOne(id);
    return coffee.remove();
  }
}
