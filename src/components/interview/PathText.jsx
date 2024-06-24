// Breadcrumb.jsx
import React from 'react';
import Link from "next/link";
import styles from '../../styles/interview/pathText.module.css';

const PathText = ({ paths }) => {
    return (
        <nav aria-label="pathText">
            <ol className={styles.pathText}>
                {paths.map((path, index) => (
                    <li key={index} className={styles.pathTextItem}>
                        {index !== paths.length - 1 ? (
                            <>
                                <Link href={path.link} className={styles.pathTextLink}>
                                    {path.name}
                                </Link>
                                <span className={styles.pathTextSeparator}>{'>'}</span>
                            </>
                        ) : (
                            <span>{path.name}</span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
};

export default PathText;
