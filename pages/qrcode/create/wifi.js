import Head from 'next/head'
import styles from '../../../styles/qrcode-create.module.css'
import Image from 'next/image'
import { useState } from 'react'
import Layout from '../../../components/layout'

export default function WebsiteQRCode({data}) {
  const [image, setImage] = useState(data.fileContents);
  const [successMessage, setSuccessMessage] = useState("");
  const [checked, setChecked] = useState(false);

  const generateCode = async event => {
    event.preventDefault();
    const response = await fetch('http://localhost:5000/PayloadQRCode/wifi', {
      body: JSON.stringify({
        ssid: event.target.ssid.value,
        password: event.target.password.value,
        authenticationMode: parseInt(event.target.authenticationMode.value),
        isHiddenSsid: checked
      }),
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST'
    })

    const data = await response.json()

    setImage(data.fileContents)
    setSuccessMessage("Successfully generated!")

    setTimeout(() => {
      setSuccessMessage("")
    }, 2000);

    return {
      props: {
        data
      }
    }
  }

  const downloadFile = async () => {
    let binaryString = window.atob(image);
    let length = binaryString.length;
    let bytes = new Uint8Array(length);

    for (var i = 0; i < length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    const url = window.URL.createObjectURL(
      new Blob([bytes.buffer, {type: 'image/png'}]),
    );

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `image.png`,
    );

    // Start download
    link.click();
  };

  return (
    <Layout>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.generation}>
            <div className={styles.header1}>Generate Wi-Fi QR Code</div>
            <form onSubmit={generateCode}>
              <label htmlFor="ssid" className={styles.label}>Network Name</label>
              <input id="ssid" name="ssid" type="text" required className={styles.input} autoComplete="off"/>
              <div className={styles.checkbox}>
                <input type="checkbox" id="isHiddenSsid" name="isHiddenSsid" checked={checked} onChange={(e) => setChecked(e.target.checked)} autoComplete="off"/>
                <label htmlFor="isHiddenSsid" className={styles.label}>Is Hidden</label>
              </div>
              <label htmlFor="password" className={styles.label}>Password</label>
              <input id="password" name="password" type="text" required className={styles.input} autoComplete="off"/>
              <label className={styles.label}>Encryption</label>
              <div className={styles.encryption}>
                <input type="radio" name="authenticationMode" value="2" autoComplete="off"/>
                <label className={styles.label}>None</label>
                <input type="radio" name="authenticationMode" value="1" autoComplete="off"/>
                <label className={styles.label}>WPA/WPA2</label>
                <input type="radio" name="authenticationMode" value="0" autoComplete="off"/>
                <label className={styles.label}>WEP</label>
              </div>
              <button className={styles.button} type="submit">
                <span className={styles.buttonText}>Generate</span>
              </button>
            </form>
            <div className={styles.success}>{successMessage}</div>
          </div>
          <div className={styles.imageContainer}>
            <Image src={"data:image/png;base64," + image} alt="image" width='310px' height="310px"></Image>
            <a className={styles.longButton} onClick={downloadFile}>
              <span className={styles.buttonText}>Download (.jpg)</span>
            </a>
          </div>
        </div>
      </main>
    </Layout>
  )
}

// This function gets called at build time
export async function getStaticProps() {
  const response = await fetch('http://localhost:5000/PayloadQRCode/wifi', {
    body: JSON.stringify({
      ssid: "",
      password: "",
      authenticationMode: 2,
      isHiddenSsid: false
    }),
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST'
  })

  const data = await response.json()

  return {
    props: {
      data
    }
  }
}
