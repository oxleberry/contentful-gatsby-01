import React from 'react'
import { graphql } from 'gatsby'
import { Helmet } from 'react-helmet'
import get from 'lodash/get'
// import Img from 'gatsby-image'
import Layout from '../components/layout'
import heroStyles from '../components/hero.module.css'


function updateFontSize() {
  // calculates width of message container, minus the padding
  const messageContainer = document.querySelector('.hero-module--message--2lCqY');
  let messageContWidth = messageContainer.clientWidth;
  let messageContPadding = window.getComputedStyle(messageContainer, null).getPropertyValue('padding-left');
  messageContPadding = parseFloat(messageContPadding, '10.00');
  messageContPadding = Math.floor(messageContPadding * 2);
  messageContWidth = messageContWidth - messageContPadding;
  // finding the longest width from each of the message lines
  const messageLines = document.querySelectorAll('.hero-module--message--2lCqY p');
  let widest = 0;
  messageLines.forEach(item => {
    if (item.clientWidth > widest) {
      widest = item.clientWidth;
    }
  })

  // getting the orig font size
  let currentFontSize = window.getComputedStyle(messageLines[0], null).getPropertyValue('font-size');
  currentFontSize = parseFloat(currentFontSize, '10.00');

  // calc and display message at full width font size
  const calcFullTextWidth = Math.floor((messageContWidth * currentFontSize) / widest) + 'px';
  messageContainer.style.fontSize = calcFullTextWidth;
  messageContainer.style.flexDirection = 'column';
}

class BlogPostTemplate extends React.Component {
  componentDidMount() {
    updateFontSize();
  }

  render() {
    const post = get(this.props, 'data.contentfulBlogPost')
    const siteTitle = get(this.props, 'data.site.siteMetadata.title')
    return (
      <Layout location={this.props.location}>
        <div style={{ background: '#fff' }}>
          <Helmet title={`${post.title} | ${siteTitle}`} />
          <div className={heroStyles.heroSection}>
            <div className={heroStyles.message}>
              <p>{post.line1}</p>
              <p>{post.line2}</p>
              <p>{post.line3}</p>
            </div>
          </div>
        </div>
      </Layout>
    )
  }
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    contentfulBlogPost(slug: { eq: $slug }) {
      title
      publishDate(formatString: "MMMM Do, YYYY")
      line1
      line2
      line3
      heroImage {
        fluid(maxWidth: 1180, background: "rgb:000000") {
          ...GatsbyContentfulFluid_tracedSVG
        }
      }
      body {
        childMarkdownRemark {
          html
        }
      }
    }
  }
`
