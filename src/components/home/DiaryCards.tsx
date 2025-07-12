import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, delay } from "framer-motion";
import dayjs from "dayjs";
import clsx from "clsx";
import { useDiaryStore } from "./Calender";
import { Button } from "../ui/button";
import { useDeleteDiary } from "../../api/queries/home/useDeleteDiary";

interface DiaryCardsProps {
  hasTodayDiary: boolean;
  todayDiary: any | null;
  diaryContent: any | null;
  isContentLoading: boolean;
  isContentError: boolean;
}

const sampleDiary = {
  id: "sample",
  title: "오늘 하루는 어땠나요? 일기를 작성해보세요.",
};

const DiaryCards = ({}: DiaryCardsProps) => {
  return <></>;
};

export default DiaryCards;
