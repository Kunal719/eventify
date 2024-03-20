"use server"

import { CreateEventParams, DeleteEventParams, GetAllEventsParams, GetEventsByUserParams, GetRelatedEventsByCategoryParams, UpdateEventParams } from "@/types";
import { connectDB } from "../db";
import Event from "../db/models/Event";
import { handleError } from "../utils";
import User from "../db/models/User";
import Category from "../db/models/Category";
import { revalidatePath } from "next/cache";

const populateEvent = async (query: any) => {
    return query
        .populate({
            path: 'category',
            model: Category,
            select: '_id name'
        })
        .populate({
            path: 'organizer',
            model: User,
            select: '_id firstName lastName'
        })
}

const getCategoryByName = async (name: string) => {
    return Category.findOne({ name: { $regex: name, $options: 'i' } })
}

export const createEvent = async ({ event, userId, path }: CreateEventParams) => {
    try {
        await connectDB()
        const organizer = await User.findById(userId);
        if (!organizer) {
            throw new Error('Organizer not found');
        }
        const newEvent = await Event.create({ ...event, category: event.categoryId, organizer: userId });
        return JSON.parse(JSON.stringify(newEvent))
    } catch (error) {
        handleError(error)
    }
}

export const getEventById = async (eventId: string) => {
    try {
        await connectDB()
        const event = await populateEvent(Event.findById(eventId))
        if (!event) {
            throw new Error('Event not found')
        }
        return JSON.parse(JSON.stringify(event))
    } catch (error) {
        handleError(error)
    }
}

export const getAllEvents = async ({ query, limit = 6, page, category }: GetAllEventsParams) => {
    try {
        await connectDB()
        const conditions = {};
        const eventsQuery = Event.find(conditions)
            .sort({ createdAt: 'desc' })
            .skip(0)
            .limit(limit);

        const events = await populateEvent(eventsQuery);
        const totalEvents = await Event.countDocuments(conditions);
        return {
            data: JSON.parse(JSON.stringify(events)),
            totalPages: Math.ceil(totalEvents / limit)
        }
    } catch (error) {
        handleError(error)
    }
}

export const deleteEvent = async ({ eventId, path }: DeleteEventParams) => {
    try {
        await connectDB()
        const deletedEvent = await Event.findByIdAndDelete(eventId);
        if (deletedEvent) {
            revalidatePath(path)
        }
    } catch (error) {
        handleError(error)
    }
}

export const updateEvent = async ({ userId, event, path }: UpdateEventParams) => {
    try {
        await connectDB()

        const eventToUpdate = await Event.findById(event._id)
        if (!eventToUpdate || eventToUpdate.organizer.toHexString() !== userId) {
            throw new Error('Unauthorized or event not found')
        }

        const updatedEvent = await Event.findByIdAndUpdate(
            event._id,
            { ...event, category: event.categoryId },
            { new: true }
        )
        revalidatePath(path)

        return JSON.parse(JSON.stringify(updatedEvent))
    } catch (error) {
        handleError(error)
    }
}

export const getEventsByUser = async ({ userId, limit = 6, page }: GetEventsByUserParams) => {
    try {
        await connectDB()

        const conditions = { organizer: userId }
        const skipAmount = (page - 1) * limit

        const eventsQuery = Event.find(conditions)
            .sort({ createdAt: 'desc' })
            .skip(skipAmount)
            .limit(limit)

        const events = await populateEvent(eventsQuery)
        const eventsCount = await Event.countDocuments(conditions)

        return { data: JSON.parse(JSON.stringify(events)), totalPages: Math.ceil(eventsCount / limit) }
    } catch (error) {
        handleError(error)
    }
}

// GET RELATED EVENTS: EVENTS WITH SAME CATEGORY
export const getRelatedEventsByCategory = async ({
    categoryId,
    eventId,
    limit = 3,
    page = 1,
}: GetRelatedEventsByCategoryParams) => {
    try {
        await connectDB()

        const skipAmount = (Number(page) - 1) * limit
        const conditions = { $and: [{ category: categoryId }, { _id: { $ne: eventId } }] }

        const eventsQuery = Event.find(conditions)
            .sort({ createdAt: 'desc' })
            .skip(skipAmount)
            .limit(limit)

        const events = await populateEvent(eventsQuery)
        const eventsCount = await Event.countDocuments(conditions)

        return { data: JSON.parse(JSON.stringify(events)), totalPages: Math.ceil(eventsCount / limit) }
    } catch (error) {
        handleError(error)
    }
}