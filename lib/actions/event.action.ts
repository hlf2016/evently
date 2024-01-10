'use server'

import { CreateEventParams, DeleteEventParams, GetAllEventsParams, GetEventsByUserParams, GetRelatedEventsByCategoryParams, UpdateEventParams } from "@/types"
import { handleError } from "../utils"
import { connectToDatabase } from "../database"
import User from "../database/models/user.model"
import Event from "../database/models/event.model"
import Category from "../database/models/category.model"
import { revalidatePath } from "next/cache"

// CREATE
export const createEvent = async ({ userId, event, path }: CreateEventParams) => {
  try {
    await connectToDatabase()

    const organizer = await User.findById(userId)
    if (!organizer) {
      throw new Error("Organizer not found")
    }

    const newEvent = await Event.create({ ...event, category: event.categoryId, organizer: userId })
    revalidatePath(path)

    return JSON.parse(JSON.stringify(newEvent))

  } catch (error) {
    handleError(error)
  }
}

const populateEvent = (query: any) => {
  return query
    .populate({ path: 'organizer', model: User, select: '_id firstName lastName' })
    .populate({ path: 'category', model: Category, select: '_id name' })
}

// GET ONE EVENT BY ID
export const getEventById = async (eventId: string) => {
  try {
    await connectToDatabase()

    const event = await populateEvent(Event.findById(eventId))
    if (!event) {
      throw new Error("Event not found")
    }

    return JSON.parse(JSON.stringify(event))
  } catch (error) {
    handleError(error)
  }
}

// UPDATE
export const updateEvent = async ({ userId, event, path }: UpdateEventParams) => {
  try {
    await connectToDatabase()
    const eventToUpdate = await Event.findById(event._id)
    // `toString()` 和 `toHexString()` 都是用于转换数据类型的方法，但它们在不同的上下文和用途中使用。

    // 1. `toString()`：这是 JavaScript 中所有对象都有的方法，用于将对象转换为字符串。对于数字，`toString()` 可以接受一个可选的基数参数，用于指定要用于数字到字符串的转换的基数（2 到 36 之间）。如果没有提供该参数，将使用基数 10。例如，`(10).toString(2)` 将返回 `"1010"`，这是 10 的二进制表示。

    // 2. `toHexString()`：这个方法通常在处理二进制数据时使用，例如在处理 MongoDB 的 ObjectId 类型时。ObjectId 是一个特殊的类型，用于 MongoDB 的文档 ID。`toHexString()` 方法将 ObjectId 对象转换为一个包含其 ID 的 24 个字符的十六进制字符串。

    // 总的来说，`toString()` 和 `toHexString()` 的主要区别在于它们的用途和返回的字符串格式。`toString()` 用于通用的对象到字符串的转换，而 `toHexString()` 通常用于特定上下文（如处理二进制数据）中的转换。
    if (!eventToUpdate || eventToUpdate.organizer.toHexString() !== userId) {
      throw new Error('Unauthorized or event not found')
    }

    const updatedEvent = await Event.findByIdAndUpdate(event._id, { ...event, category: event.categoryId }, { new: true })
    revalidatePath(path)

    return JSON.parse(JSON.stringify(updatedEvent))
  } catch (error) {
    handleError(error)
  }
}

// DELETE
export const deleteEvent = async ({ eventId, path }: DeleteEventParams) => {
  try {
    await connectToDatabase()

    const deletedEvent = await Event.findByIdAndDelete(eventId)
    if (deletedEvent) revalidatePath(path)
  } catch (error) {
    handleError(error)
  }
}

const getCategoryByName = async (name: string) => {
  return await Category.findOne({ name: { $regex: name, $options: 'i' } })
}

// GET ALL EVENTS
export const getAllEvents = async ({ query, limit = 6, page, category }: GetAllEventsParams) => {
  try {
    await connectToDatabase()

    const titleCondition = query ? { title: { $regex: query, $options: 'i' } } : {}
    const categoryCondition = category ? await getCategoryByName(category) : null

    const conditions = {
      $and: [
        titleCondition,
        categoryCondition ? { category: categoryCondition._id } : {}
      ]
    }

    const skipAmount = limit * (Number(page) - 1)
    const eventsQuery = Event.find(conditions)
      .sort({ createdAt: 'desc' })
      .skip(skipAmount)
      .limit(limit)

    const events = await populateEvent(eventsQuery)
    const eventsCount = await Event.countDocuments(conditions)

    return {
      data: JSON.parse(JSON.stringify(events)),
      totalPages: Math.ceil(eventsCount / limit)
    }
  } catch (error) {
    handleError(error)
  }
}

// GET EVENTS BY ORGANIZER
export const getEventsByUser = async ({ userId, limit = 6, page }: GetEventsByUserParams) => {
  try {
    await connectToDatabase()

    const conditions = { organizer: userId }
    const skipAmount = limit * (Number(page) - 1)

    const eventsQuery = Event.find(conditions)
      .sort({ createdAt: 'desc' })
      .skip(skipAmount)
      .limit(limit)

    const events = await populateEvent(eventsQuery)
    const eventsCount = await Event.countDocuments(conditions)

    return {
      data: JSON.parse(JSON.stringify(events)),
      totalPages: Math.ceil(eventsCount / limit)
    }

  } catch (error) {
    handleError(error)
  }
}

// GET RELATED EVENTS: EVENTS WITH SAME CATEGORY
export const getRelatedEventsByCategory = async ({ categoryId, eventId, limit = 3, page = 1 }: GetRelatedEventsByCategoryParams) => {
  try {
    await connectToDatabase()

    const conditions = {
      $and: [
        { category: categoryId },
        { _id: { $ne: eventId } }
      ]
    }

    const skipAmount = limit * (Number(page) - 1)
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
