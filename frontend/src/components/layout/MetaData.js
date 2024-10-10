// This file Created to add custom data titles
// Title means the web page title

// import Helmet to create custom titles
import { Helmet } from 'react-helmet'

import React from 'react'

// in here we use props to pass data from component to component
const MetaData = ({ title }) => {
  return (
    <Helmet>
        <title>{`${title} - FitMan Sports`}</title>
    </Helmet>
  )
}

export default MetaData
