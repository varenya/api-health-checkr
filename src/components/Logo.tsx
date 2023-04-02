import React from 'react'
import Image from 'next/image'
import logo from '../../public/nium.svg' 

export const Logo = (props : {}) => {
	return (
		<div>
			<Image src={logo} />	
		</div>
	)
}
