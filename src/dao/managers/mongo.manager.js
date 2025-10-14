class MongoManager {
  constructor(model) {
    this.model = model;
  }

  createOne = async (data) => this.model.create(data);
  readAll = async (filter) => this.model.find(filter);
  readOne = async (obj) => this.model.findOne(obj);
  readById = async (id) => this.model.findById(id);
  updateOne = async (obj, data) => this.model.findOneAndUpdate(obj, data);
  updateById = async (id, data) =>
    this.model.findByIdAndUpdate(id, data, { new: true });
  destroyOne = async (obj) => this.model.findOneAndDelete(obj);
  destroyById = async (id) => this.model.findByIdAndDelete(id);
}

export default MongoManager;
