const graphql = require("graphql");
const _ = require("lodash");
const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLInt, GraphQLList } = graphql;

var cId = 5;
var comId = 4;
var cars = [
    { name: "A-Class", price: "$33,795", id: "1", companyId: "2" },
    { name: "AMG GT", price: "$100,945", id: "2", companyId: "2" },
    { name: "Camry", price: "$25,380", id: "3", companyId: "1" },
    { name: "i8", price: "$147,500", id: "4", companyId: "3" },
    { name: "M8 Gran Coupe", price: "$130,000", id: "5", companyId: "3" }
]

var companies = [
    { name: "Toyota", location: "Japan", id: "1" },
    { name: "Mercedes", location: "Germany", id: "2" },
    { name: "BMW", location: "Germany", id: "3" }
]

const CarType = new GraphQLObjectType({
    name: "Car",
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        company: {
            type: CompanyType,
            resolve(parent, args) {
                return _.find(companies, { id: parent.companyId })
            }
        }


    })
})
// type relation

const CompanyType = new GraphQLObjectType({
    name: "Company",
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        cars: {
            type: new GraphQLList(CarType),
            resolve(parent, args) {
                return _.filter(cars, { companyId: parent.id })
            }
        }
    })
})


const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        car: {
            type: CarType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                // code to get data from db / other source
                return _.find(cars, { id: args.id });
            }
        },
        company: {
            type: CompanyType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return _.find(companies, { id: args.id });
            }
        },
        cars: {
            type: new GraphQLList(CarType),
            resolve(parent, args) {
                return cars;
            }
        },
        companies: {
            type: new GraphQLList(CompanyType),
            resolve(parent, args) {
                return companies;
            }
        }
    }
})


const Mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        addCompany: {
            type: CompanyType,
            args: { name: { type: GraphQLString }, location: { type: GraphQLString } },
            resolve(parent, args) {
                comId += 1
                let company = { name: args.name, location: args.location, id: comId }
                companies = companies.concat(company);
                return company;
            }
        },
        addCar: {
            type: CarType,
            args: { name: { type: GraphQLString }, price: { type: GraphQLString }, companyId: { type: GraphQLString } },
            resolve(parent, args) {
                cId += 1
                let car = { name: args.name, price: args.price, companyId: args.companyId, id: cId }
                cars = cars.concat(car);
                return car;
            }
        }
    }

})






module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});




