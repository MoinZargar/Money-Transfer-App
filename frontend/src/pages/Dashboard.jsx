import React from 'react'
import {Balance, Users} from '../index.js'
import useGetAccountBalance from '../hooks/useGetAccountBalance.jsx'

function Dashboard() {
  const {balance,loading,error} = useGetAccountBalance();
  return !loading ? ( 
    <div className='pt-4'>
      <Balance balance={balance} />
      <Users />
    </div>
  ) : (<div>Loading...</div>)
}

export default Dashboard