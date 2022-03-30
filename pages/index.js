import _ from 'lodash';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

import styles from '../styles/Home.module.css';

export async function getStaticProps(context) {
    try {
        const res = await fetch(`${process.env.API_URL || 'http://localhost:3000'}/api/graphql`, {
            body: JSON.stringify({
                source: 'events',
                variableValues: {
                    limit: 50,
                    orderBy: [['title'], ['asc']]
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
                events: response.data.events
            }
        };
    } catch (err) {
        return {
            props: {
                events: []
            }
        };
    }
};

export default props => {
    const {
        events
    } = props;

    return (
        <div className={styles.container}>
            <Head>
                <title>Windfit</title>
                <meta name='description' content='All Events'/>
                <link rel='icon' href='/favicon.ico'/>
            </Head>

            <main className={styles.main}>
                <h1 className={styles.title}>
                    Welcome to <Link href='/'>Windfit Graphql Lab!</Link>
                </h1>

                <p className={styles.description}>
                    Showing {events.count} events.
                </p>

                <div className={styles.grid}>
                    {_.map(events.data, event => {
                        return (
                            <Link key={event.id}
                                href={`/${event.id}`}>
                                <a className={styles.card}>
                                    <h2>{event.name} &rarr;</h2>
                                    <p>{event.description}</p>
                                </a>
                            </Link>
                        );
                    })}
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