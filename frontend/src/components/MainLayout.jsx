import React from 'react'
import { Outlet } from 'react-router-dom'
import LeftSideBar from './LeftSideBar' 

function MainLayout() {
  return (
	<div>
	  <LeftSideBar />
	  <Outlet /> 
	</div>
  )
}

export default MainLayout
