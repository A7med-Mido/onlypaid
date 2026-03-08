import { getServerSession } from 'next-auth'
import React from 'react'

export default async function page() {
  const session = await getServerSession();
  // console.log(session)
  return (
    <div>
      {JSON.stringify(session)}
    </div>
  )
}
