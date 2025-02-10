const { PrismaClient } = require("@prisma/client");

class Prisma {

    constructor() {
        this.prisma = new PrismaClient()
    }

    async saveUser(name, email, password, role) {
        return await this.prisma.user.create({
            data: {
                name: name,
                email: email,
                password: password,
                role: role || 'USER'
            }
        })
    }
    
    async getUserByEmail(email) {
        return await this.prisma.user.findUnique({
            where: {
                email: email
            },
        })
    }

    async getUserById(id) {
        return await this.prisma.user.findUnique({
            where: {
                id: id,
            },
        })
    }

    async getUsers() {
        return await this.prisma.user.findMany()
    }

    async deleteUser(id) {
        return this.prisma.user.delete({
            where: {
                id: id
            }
        })
    }

    async updateUser(id, name, email) {
        return await this.prisma.user.update({
            where: {
                id: id
            },
            data: {
                name: name,
                email: email,
            }
        });
    }

}

const prisma = new Prisma();

module.exports = prisma;