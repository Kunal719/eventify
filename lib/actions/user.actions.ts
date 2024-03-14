'use server'

import { CreateUserParams, UpdateUserParams } from "@/types"
import { handleError } from "../utils"
import { connectDB } from "../db"
import User from "../db/models/User"
import Event from "../db/models/Event"
import Order from "../db/models/Order"
import { revalidatePath } from "next/cache"

export const createUser = async (user: CreateUserParams) => {
    try {
        await connectDB();
        const newUser = await User.create(user);

        return JSON.parse(JSON.stringify(newUser));
    } catch (error) {
        handleError(error)
    }
}

export const getUserById = async (userId: string) => {
    try {
        await connectDB();

        const user = await User.findById(userId)

        if (!user) throw new Error('User not found')
        return JSON.parse(JSON.stringify(user))
    } catch (error) {
        handleError(error)
    }
}

export const updateUser = async (clerkId: string, user: UpdateUserParams) => {
    try {
        await connectDB();

        const updatedUser = await User.findOneAndUpdate({ clerkId }, user, { new: true });
        if (!updatedUser) {
            throw new Error('User not found/updated');
        }

        return JSON.parse(JSON.stringify(updatedUser));
    } catch (error) {
        handleError(error)
    }
}

export const deleteUser = async (clerkId: string) => {
    try {
        await connectDB();

        const userToDelete = await User.findOne({ clerkId });

        if (!userToDelete) {
            throw new Error('User not found');
        }

        // Unlink relationships
        await Promise.all([
            // Update the 'events' collection to remove references to the user
            Event.updateMany(
                { _id: { $in: userToDelete.events } },
                { $pull: { organizer: userToDelete._id } }
            ),

            // Update the 'orders' collection to remove references to the user
            Order.updateMany({ _id: { $in: userToDelete.orders } }, { $unset: { buyer: 1 } }),
        ])

        const deletedUser = await User.findOneAndDelete(userToDelete._id);
        revalidatePath('/');

        return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null;
    } catch (error) {

    }
}