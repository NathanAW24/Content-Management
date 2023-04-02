import { LeftOutlined, RightOutlined, UploadOutlined, UpOutlined } from '@ant-design/icons';
import { useUser } from '@auth0/nextjs-auth0';
import { Button, Popconfirm, Spin } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import VerifyEmailPage from '../../components/VerifyEmailPage';
import AssetSelectionForm from './components/assetSelectionForm';
import CampaignDetailsForm from './components/campaignDetailsForm';

function useCreateCampaignForms({ initialPayload, onNext, onPrev }: any) {
  const [payload, setPayload] = useState(initialPayload);
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    setPayload({ ...initialPayload });
  }, [initialPayload]);
  // useEffect(() => {
  //   console.log('payload updated in useCreate campaign (not create campaign)', payload);
  // }, [payload]);
  const generateForms = useCallback(() => {
    setLoading(true);
    const forms = [
      {
        formName: 'Asset',
        title: 'Asset',
        desc: 'Pick Asset for Campaign!',
        form: (
          <div className="flex flex-col">
            <AssetSelectionForm payload={payload} setPayload={setPayload} />
            <Button
              size="large"
              className="w-36 h-20 hover:opacity-80 text-2xl rounded-lg place-self-end bg-gray-500 hover:bg-gray-800  focus:bg-black border-0"
              type="primary"
              onClick={() => {
                onNext(payload);
                // console.log('payloadbuttttonnnn', payload);
              }}
            >
              Next
              <RightOutlined className="text-xl my-5 " />
            </Button>
          </div>
        ),
      },
      {
        formName: 'Target',
        title: 'Target',
        desc: 'Input the target and descriptions for your campaign!',
        form: (
          <div className="flex flex-col">
            <CampaignDetailsForm payload={payload} setPayload={setPayload} />
            <div className="flex justify-between">
              <Button
                size="large"
                className="w-36 h-20 hover:opacity-80 text-2xl rounded-lg place-self-start bg-gray-500 hover:bg-gray-800 focus:bg-black border-0"
                type="primary"
                onClick={() => onPrev(payload)}
              >
                <LeftOutlined className="text-xl my-5 " />
                Prev
              </Button>
              {/* <Button
                size="large"
                className="w-36 h-20 hover:opacity-80 text-2xl rounded-lg place-self-end bg-gray-500 hover:bg-gray-800 focus:bg-black border-0"
                type="primary"
                onClick={() => onNext(payload)}
              >
                Next
                <RightOutlined className="text-xl my-5 " />
              </Button> */}
              <Popconfirm title="Are you sure to submit?" onConfirm={() => onNext(payload)} okText="Yes">
                <Button
                  disabled={isSubmitted}
                  size="large"
                  className="w-36 h-20 hover:opacity-80 text-2xl rounded-lg place-self-end bg-gray-500 hover:bg-gray-800 focus:bg-black border-0"
                  type="primary"
                >
                  Submit
                  <UploadOutlined className="text-xl my-5 " />
                </Button>
              </Popconfirm>
            </div>
          </div>
        ),
      },
      // {
      //   formName: 'Budget',
      //   title: 'Budget',
      //   desc: 'Adjust your budget and impression for your campaign!',
      //   form: (
      //     <div className="flex flex-col">
      //       <div className="flex justify-between">
      //         <Button
      //           size="large"
      //           className="w-36 h-20 hover:opacity-80 text-2xl rounded-lg place-self-start bg-gray-500 hover:bg-gray-800 focus:bg-black border-0"
      //           type="primary"
      //           onClick={() => onPrev(payload)}
      //         >
      //           <LeftOutlined className="text-xl my-5 " />
      //           Prev
      //         </Button>
      //         <Popconfirm title="Are you sure to submit?" onConfirm={() => onNext(payload)} okText="Yes">
      //           <Button
      //             size="large"
      //             className="w-36 h-20 hover:opacity-80 text-2xl rounded-lg place-self-end bg-gray-500 hover:bg-gray-800 focus:bg-black border-0"
      //             type="primary"
      //           >
      //             Submit
      //             <UploadOutlined className="text-xl my-5 " />
      //           </Button>
      //         </Popconfirm>
      //       </div>
      //     </div>
      //   ),
      // },
    ];
    setLoading(false);
    return forms;
  }, [payload]);

  return {
    generateForms,
    isSubmitting: loading,
    setIsSubmitted,
  };
}

export default useCreateCampaignForms;
