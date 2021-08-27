import Head from 'next/head'
import styles from '../../../styles/Home.module.css'
import Image from 'next/image'
import { useState } from 'react'
import Layout from '../../../components/layout'

function QrCodeCreate({data}) {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [image, setImage] = useState(data.fileContents)

  const generateCode = async() => {
    const res = await fetch('http://localhost:5000/PayloadQRCode/phoneNumber?number=' + phoneNumber)
    const data = await res.json()

    setImage(data.fileContents)

    return {
      props: {
        data,
      },
    }
  }

  return (
    <Layout>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.header1}>Generate QR Code</div>
        <div className={styles.container}>
          <div>
            <div>Complete phone number here</div>
            <div>
              <input id="phone-number" className={styles.input} type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)}/>
            </div>
            <a className={styles.button}>
              <span className={styles.buttonText} onClick={generateCode}>Generate</span>
            </a>
          </div>
          <div>
            <Image src={"data:image/png;base64," + image} alt="image" width='310px' height="310px"></Image>
            <a className={styles.longButton}>
              <span className={styles.buttonText}>Download</span>
            </a>
          </div>
        </div>
      </main>
    </Layout>
  )
}

// This function gets called at build time
export async function getStaticProps() {
  const res = await fetch('http://localhost:5000/PayloadQRCode/phoneNumber?number=')
  const data = await res.json()

  return {
    props: {
      data,
    },
  }
}

export async function getStaticPaths() {
  const paths = [
    { params: { id: 'map' } },
    { params: { id: 'website' } },
    { params: { id: 'number' } }
  ]

  return {
    paths,
    fallback: true
  }
}

export default QrCodeCreate
