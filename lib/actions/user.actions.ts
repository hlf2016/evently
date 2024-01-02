'use server'

import { connectToDatabase } from '../database'
import { handleError } from '../utils'
import { CreateUserParams, UpdateUserParams } from '@/types'
import User from '../database/models/user.model'
import Event from '../database/models/event.model'
import Order from '../database/models/order.model'
import { revalidatePath } from 'next/cache'


export const createUser = async (user: CreateUserParams) => {
  try {
    await connectToDatabase()
    const newUser = await User.create(user)
    return JSON.parse(JSON.stringify(newUser))
  } catch (error) {
    handleError(error)
  }
}

export async function getUserById(userId: string) {
  try {
    await connectToDatabase()

    const user = await User.findById(userId)

    if (!user) throw new Error('User not found')
    return JSON.parse(JSON.stringify(user))
  } catch (error) {
    handleError(error)
  }
}

export const updateUser = async (clerkId: string, user: UpdateUserParams) => {
  try {
    await connectToDatabase()

    const updatedUser = await User.findOneAndUpdate({ clerkId }, user, { new: true })

    if (!updatedUser) {
      throw new Error('User update failed')
    }

    return JSON.parse(JSON.stringify(updatedUser))

  } catch (error) {
    handleError(error)
  }
}

export const deleteUser = async (clerkId: string) => {
  try {
    const userToDelete = await User.findOne({ clerkId })
    if (!userToDelete) {
      throw new Error('User not found')
    }
    // 删除跟用户相关的 events  和 orders
    // 这两行代码都使用了 MongoDB 的更新操作符，如 $in、$pull 和 $unset。$in 用于匹配数组中的任何值，$pull 用于从数组中删除特定值，$unset 用于删除字段。
    await Promise.all([
      // 更新 "event "集合，删除对用户的引用
      Event.updateMany(
        { _id: { $in: userToDelete.events } },
        { $pull: { organizer: userToDelete._id } }
      ),
      // 更新‘Order’集合以删除对该用户的引用
      Order.updateMany({ _id: { $in: userToDelete.orders } }, { $unset: { buyer: 1 } }),
    ])

    // Delete user
    const deletedUser = await User.findByIdAndDelete(userToDelete._id)

    revalidatePath('/')

    return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null
  } catch (error) {
    handleError(error)
  }
}
