// components/StressTest.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom'; // 추가
import { Card, CardHeader} from '../ui/card';
import { Button } from '../ui/button';
import { CirclePlus, Target } from 'lucide-react';
import { toast } from 'sonner';

interface StressProps {
  memSummary: any | null;
}

const StressTest: React.FC<StressProps> = ({ memSummary }) => {
  const navigate = useNavigate(); // 추가
  let depressionWarning = false;
  let streeWarning = false;
  let anxietyWarning = false;

  return (
    <div className='wrapper space-y-2'>
     {streeWarning ? 
     <div className="mb-4 mt-8">
        <h3 className="text-lg font-semibold text-white">
          스트레스 수치가 위험해요
        </h3>

        <Card className='mt-4 flex justify-center'>
          <CardHeader> 
            <p>근 3일간의 스트레스 수치가 높습니다.</p>
            <p>자세한 나의 상태를 확인해 보세요.</p>
          </CardHeader>
        </Card>

        <Button
            className="w-full"
            style={{
              backgroundColor: "#ff6b6b",
              color: "#ffffff",
              border: "none",
            }}
            onClick={() => navigate('/aboutme')} // 수정된 부분
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#fd3f3f")}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#ff6b6b")}
          >
            테스트 보러 가기
        </Button>
     </div> : 
     <div></div>
     }

  {depressionWarning ? 
     <div className="mb-4 mt-8">
        <h3 className="text-lg font-semibold text-white">
          우울 수치가 위험해요
        </h3>

        <Card className='mt-4 flex justify-center'>
          <CardHeader> 
            <p>근 3일간의 스트레스 수치가 높습니다.</p>
            <p>자세한 나의 상태를 확인해 보세요.</p>
          </CardHeader>
        </Card>

        <Button
            className="w-full"
            style={{
              backgroundColor: "#ff6b6b",
              color: "#ffffff",
              border: "none",
            }}
            onClick={() => navigate('/aboutme')} // 수정된 부분
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#fd3f3f")}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#ff6b6b")}
          >
            테스트 보러 가기
        </Button>
     </div> : 
     <div></div>
     }

  {anxietyWarning ? 
     <div className="mb-4 mt-8">
        <h3 className="text-lg font-semibold text-white">
          불안 수치가 위험해요
        </h3>

        <Card className='mt-4 flex justify-center'>
          <CardHeader> 
            <p>근 3일간의 불안안 수치가 높습니다.</p>
            <p>자세한 나의 상태를 확인해 보세요.</p>
          </CardHeader>
        </Card>

        <Button
            className="w-full"
            style={{
              backgroundColor: "#ff6b6b",
              color: "#ffffff",
              border: "none",
            }}
            onClick={() => navigate('/aboutme')} // 수정된 부분
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#fd3f3f")}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#ff6b6b")}
          >
            테스트 보러 가기
        </Button>
     </div> : 
     <div></div>
     }
     <div className="mb-4 mt-8">
        <h3 className="text-lg font-semibold text-white">
          추가 컨텐츠 보기
        </h3>

        <Card className='mt-4 flex justify-center'>
          <CardHeader> 
            <p>저희가 당신의 일기를 토대로</p>
            <p>컨텐츠를 추천해 드릴게요.</p>
          </CardHeader>
        </Card>

        <Button
            className="w-full"
            style={{
              backgroundColor: "#2eb9c0",
              color: "#ffffff",
              border: "none",
            }}
            onClick={() => navigate('/video')} 
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#18adc7")}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#2eb9c0")}
          >
          컨텐츠 확인하기
        </Button>
     </div> 
    </div>
  );
};

export default StressTest;
