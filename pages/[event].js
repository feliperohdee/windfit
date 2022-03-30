import _ from 'lodash';
import Head from 'next/head';
import Image from 'next/image';

import styles from '../styles/Home.module.css';

export async function getStaticPaths() {
    return {
        fallback: 'blocking',
        paths: []
    };
};

export async function getStaticProps(context) {
    const {
        params
    } = context;

    try {
        const res = await fetch(`${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'}/api/graphql`, {
            body: JSON.stringify({
                source: 'event',
                variableValues: {
                    id: params.event
                }
            }),
            headers: {
                'content-type': 'application/json'
            },
            method: 'POST'
        });

        const response = await res.json();

        return {
            props: {
                event: response.data.event
            }
        };
    } catch (err) {
        return {
            props: {
                event: null
            }
        };
    }
};

export default props => {
    const {
        event
    } = props;

    return (
        <div className={styles.container}>
            <Head>
                <title>Windfit - {event.name}</title>
                <meta name='description' content={event.description}/>
                <link rel='icon' href='/favicon.ico'/>
            </Head>

            <main className={styles.main}>
                <h1 className={styles.title}>
                    {event.name}
                </h1>

                <div className={styles.description}>
                    {event.description}
                    <br/>
                    <ul>
                        {_.map(event.partners, partner => {
                            return (
                                <li key={partner.id}>
                                    {partner.name}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </main>

            <footer className={styles.footer}>
                <a
                    href='https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app'
                    target='_blank'
                    rel='noopener noreferrer'>
                    Powered by{' '}
                    <span className={styles.logo}>
                        <Image src='/vercel.svg' alt='Vercel Logo' width={72} height={16}/>
                    </span>
                </a>
            </footer>
        </div>
    );
};