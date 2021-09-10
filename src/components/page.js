import React from 'react';
import { Helmet } from 'react-helmet';

import '../styles/cards.scss';

const Page = ({ title, children }) => {
  return (
    <div>
      <Helmet>
        <meta charSet='utf-8' />
        <title>{title}</title>
        <link rel='canonical' href='https://remember-the-ginger.bradleystaples.com/' />
        <meta name='description' content='A fun, fast card game of "concentration" more commonly known as Match or Memory, simply flip cards over to match them with their twin until you have matched all the cards.' />
        <meta name='author' content='Bradley Staples' />
        <link rel='shortcut' href='/favicon.ico' />
        <meta name='robots' content='index, follow' />
        <meta name='viewport' content='width=device-width, initial-scale=1, shrink-to-fit=no' />
        <link href='http://fonts.googleapis.com/css?family=Arapey' rel='stylesheet' type='text/css' />
      </Helmet>
      <div className='wrapper clearfix'>
        {children}
      </div>
    </div>
  )
};

export default Page;
