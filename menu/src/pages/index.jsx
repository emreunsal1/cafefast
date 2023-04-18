import MENU_SERVICE from '@/services/menu'
import React, { useEffect } from 'react'

export default function index() {

  useEffect(() => {
    MENU_SERVICE.getMenu("64208d2c890cdcf8376c87a5");
  }, [])
  
  return (
    <div>index</div>
  )
}
