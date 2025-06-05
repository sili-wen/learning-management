"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useCarousel } from "@/hooks/useCarousel";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetCoursesQuery } from "@/state/api";
import CourseCardSearch from "@/components/CourseCardSearch";

const LoadingSkeleton = () => {
  return (
    <div className="landing-skeleton">
      <div className="landing-skeleton__hero">
        <div className="landing-skeleton__hero-content">
          <Skeleton className="landing-skeleton__title" />
          <Skeleton className="landing-skeleton__subtitle" />
          <Skeleton className="landing-skeleton__subtitle-secondary" />
          <Skeleton className="landing-skeleton__button" />
        </div>
        <Skeleton className="landing-skeleton__hero-image" />
      </div>
      <div className="landing-skeleton__featured">
        <Skeleton className="landing-skeleton__featured-title" />
        <Skeleton className="landing-skeleton__featured-description" />
        <div className="landing-skeleton__tags">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="landing-skeleton__tag" />
            ))}
        </div>
      </div>
    </div>
  );
};

const Landing = () => {
  const currentImage = useCarousel({ totalImages: 3 });
  const { data: courses, isLoading, isError } = useGetCoursesQuery({});

  if (isLoading) return <LoadingSkeleton />;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="landing"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="landing__hero"
      >
        <div className="landing__hero--content">
          <h1 className="landing__title p-8">Courses</h1>
          <p className="landing__description p-8">
            This is a list of courses you can enroll.
            <br />
            Courses when you need them and want them.
          </p>
          <div className="landing__cta p-8">
            <Link href="/search">
              <div className="landing__cta-button p-8">Search for Courses</div>
            </Link>
          </div>
        </div>
        <div className="landing__hero-images">
          {["/hero1.jpg", "/hero2.jpg", "/hero3.jpg"].map((src, index) => (
            <Image
              key={src}
              src={src}
              alt={`Hero Banner ${index + 1}`}
              fill
              priority={index === currentImage}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className={`landing__hero-image ${
                index === currentImage ? "landing__hero-image--active" : ""
              }`}
            />
          ))}
        </div>
      </motion.div>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ amount: 0.3, once: true }}
        className="landing__featured"
      >
        <h2 className="landing__featured-title">Featured Courses</h2>
        <p className="landing__featured-description">
          From beginner to advanced, for all industries, we have the right
          courses for you to prepare you for learning and work.
        </p>

        <div className="landing__tags">
          {[
            "web development",
            "enterprise IT",
            "react nextjs",
            "javascript",
            "backend development",
          ].map((tag, index) => (
            <span key={index} className="landing__tag">
              {tag}
            </span>
          ))}
        </div>

        <div className="landing__courses">
          {courses &&
            courses.slice(0, 6).map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ amount: 0.3, once: true }}
                className="landing__featured"
              >
                <CourseCardSearch course={course}></CourseCardSearch>
              </motion.div>
            ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Landing;
