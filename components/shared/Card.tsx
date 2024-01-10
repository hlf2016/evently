import { IEvent } from "@/lib/database/models/event.model"
import { auth } from '@clerk/nextjs'
import Link from 'next/link'
import Image from 'next/image'
import { DeleteConfirmation } from "./DeleteConfirmation"
import { formatDateTime } from "@/lib/utils"

type CardProps = {
  event: IEvent,
  hasOrderLink?: boolean,
  hidePrice?: boolean
}

const Card = ({ event, hasOrderLink, hidePrice }: CardProps) => {
  const { sessionClaims } = auth()
  const userId = sessionClaims?.userId as string

  const isEventCreator = userId === event.organizer._id.toString()

  return (
    <div className="group relative w-full min-h-[380px] max-w-[400px] flex flex-col overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-lg md:min-h-[438px]">
      <Link
        href={`/events/${event._id}`}
        style={{ backgroundImage: `url(${event.imageUrl})` }}
        className="flex-center flex-grow bg-gray-50 bg-cover bg-center text-grey-500"
      />

      {/* IS EVENT CREATOR ... */}

      {isEventCreator && !hidePrice && (
        <div className="absolute top-2 right-2 flex flex-col gap-4 bg-white p-3 rounded-xl shadow-sm transition-all">
          <Link href={`/events/${event._id}/update`}>
            <Image src='/assets/icons/edit.svg' alt='edit' width={20} height={20} />
          </Link>
          <DeleteConfirmation eventId={event._id} />
        </div>
      )}

      <div className="flex min-h-[230px] flex-col gap-3 p-5 md:gap-4">
        {!hidePrice && (
          <div className="flex gap-2">
            <span className="p-semibold-14 w-min rounded-full bg-green-100 px-4 py-1 text-green-60">
              {event.isFree ? 'FREE' : `$${event.price}`}
            </span>
            <p className="p-semibold-14 w-min rounded-full bg-green-500/10 px-4 py-1 text-grey-500 line-clamp-1">
              {event.category.name}
            </p>
          </div>
        )}
        <p className="p-medium-16 p-medium-18 text-grey-500">{formatDateTime(event.startDateTime).dateTime}</p>
        <Link href={`/events/${event._id}`}>
          {/* line-clamp-2实际上是设置最多显示2行文本，超出部分将被隐藏并用省略号表示。请注意，为了使其正确工作，您还需要在元素上应用 overflow-hidden */}
          <p className="p-medium-16 md:p-medium-20 line-clamp-2 flex-1 text-black">{event.title}</p>
        </Link>
        <div className="flex-between w-full">
          <p className="p-medium-14 md:p-medium-16 text-grey-600">
            {event.organizer.firstName} {event.organizer.lastName}
          </p>
          {!hasOrderLink && (
            <Link href={`/orders?eventId=${event._id}`} className="flex gap-2">
              <p className="text-primary-500">Order Details</p>
              <Image src="/assets/icons/arrow.svg" alt="search" width={10} height={10} />
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default Card
