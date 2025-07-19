import { useState } from "react";
import { useCreateTodo } from "@/api/queries/todo/useCreateTodo";
import { useSelectedDate } from "@/hooks/useSelectedDate";
import { formatDate } from "@/utils/date";
import { Checkbox } from "@/components/ui/checkbox";
import { useTheme } from "../theme-provider";


/**
 * ✅ 한글 IME(조합형 입력기) 트러블슈팅 요약:
 *  - 한글 입력은 '조합 중' 상태에서 Enter가 두 번 트리거돼 마지막 글자가 중복 등록됨.
 *  - isComposing 플래그로 조합 중 여부를 감지해 중복 등록 방지.
 *  - preventDefault()로 form submit 기본 동작도 막아 새로고침 방지.
 */

export default function TodoInputRow() {
    const { mutate } = useCreateTodo();
    const { selectedDate } = useSelectedDate();
    const { theme } = useTheme();
    const isDark =
        theme === "dark" ||
        (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    const [value, setValue] = useState("");
    const [isComposing, setIsComposing] = useState(false);  // ✅ IME 조합 중 상태 관리

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        // ✅ 조합 중에는 Enter 키를 무시해야 한글 입력이 정상 처리됨
        if (e.key === "Enter" && !isComposing && value.trim()) {
            e.preventDefault();     // ✅ preventDefault()는 <form> 구조에서 Enter 시 submit 방지 역할
            mutate({ content: value.trim(), date: formatDate(selectedDate) });
            setValue("");           // 인풋 초기화
        }
    };
    
    return (
        <li className="flex items-center gap-3">
            {/* 비어있는 체크박스 자리 */}
            <Checkbox
                disabled
                className={
                    `flex-shrink-0 opacity-50 border ${isDark ? 'border-white' : 'border-black'} bg-transparent`
                }
            />
            
            {/* 인라인 input */}
            <input
                type="text"
                placeholder="New todo"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onCompositionStart={() => setIsComposing(true)}   // ✅ 조합 시작 시 플래그 true
                onCompositionEnd={() => setIsComposing(false)}    // ✅ 조합 끝나면 false
                className="w-full bg-transparent outline-none placeholder:text-gray-400"
            />
        </li>
    );
}