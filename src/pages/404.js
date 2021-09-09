import React from 'react';
import { Link } from 'gatsby';

import Page from '../components/page';
import Footer from '../components/footer';

const NotFoundPage = () => {
  return (
    <Page title='Not Found | Remember The Ginger'>
      <h1>Page not found</h1>
      <p>Go <Link to='/'>home</Link>.</p>
      <Footer />
    </Page>
  )
};

export default NotFoundPage;
