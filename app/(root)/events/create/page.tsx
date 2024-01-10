import { auth } from '@clerk/nextjs'
import EventForm from '@/components/shared/EventForm'

const EventCreate = () => {

  const { sessionClaims } = auth()

  //  此处 的 userId 是指的 mongodb 中生成的 userId 而不是 clerk 中的 userId 
  // 是在 app/api/webhooks/clerk/route.ts 中 创建用户的逻辑中 添加成功后 放到 clerk session 的 publicMetadata 中的 所以需要在 clerk dashboard 中的 sessions 配置中设置 session 格式为 {"userId": "{{user.public_metadata.userId}}"} 才可以获取到 正确的 userId
  const userId = sessionClaims?.userId as string
  console.log(userId)

  return (
    <>
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10 ">
        <h3 className="wrapper text-center h3-bold sm:text-left">Create Event</h3>
      </section>
      <div className='wrapper my-8'>
        <EventForm userId={userId} type='create' />
      </div>
    </>
  )
}

export default EventCreate
