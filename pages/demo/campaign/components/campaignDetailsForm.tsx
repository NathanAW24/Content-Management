/* eslint-disable operator-linebreak */
/* eslint-disable indent */
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Form,
  Select,
  Typography,
  message,
  Radio,
  Checkbox,
  Button,
  Input,
  Row,
  Col,
  Switch,
  DatePicker,
  Alert,
  InputNumber,
} from 'antd';
import { FieldValue } from 'firebase/firestore';
import React, { useState } from 'react';
import { CampaignPayload } from './payload.type';

type PropsType = {
  payload: CampaignPayload;
  setPayload: React.Dispatch<React.SetStateAction<CampaignPayload>>;
};
// export type CampaignPayload = {
//   campaignName: string;
//   preferences: string[];
//   startDate: Date;
//   endDate: Date;
//   deployWhenApproved?: boolean;
// };

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 3,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 20,
    },
  },
};

const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: {
      span: 20,
      offset: 3,
    },
    sm: {
      span: 20,
      offset: 3,
    },
  },
};

function dateDifferenceInDays(startDate: Date, endDate: Date) {
  return (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24);
}

type FormPayload = {
  campaignName: string;
  owner: string;
  assets: string[];
  status: string;
  totalDuration: number;
  preferences: string[];
  monthlyImpressionTarget: number;
  startDate: Date;
  endDate: Date;
  Date: Date[];
  deployWhenApproved?: boolean | undefined;
};

function CampaignDetailsForm({ payload, setPayload }: PropsType) {
  const [campaignDetails, setCampaignDetails] = useState<CampaignPayload>();
  const [chosenImpression, setChosenImpression] = useState<number>(20);
  const [campaignStartDate, setCampaignStartDate] = useState<Date>(payload.startDate);
  const [campaignEndDate, setCampaignEndDate] = useState<Date>(payload.startDate);

  const onFinish = (values: FormPayload) => {
    // console.log('INI VALUES', values);
    // console.log(values.Date);

    values.startDate = values.Date[0];
    values.endDate = values.Date[1];

    // console.log('SETELAH DIHAPUS Date Fieldnya ', values);

    message.info('Saved campaign details. Click Next to continue.');
    setCampaignDetails(values);
    setPayload(values);
    // console.log('Received values of form: ', values);

    // console.log(campaignDetails);
  };

  // console.log(payload);

  return (
    <>
      <Form name="validate_other" {...formItemLayout} onFinish={onFinish} className="bg-white p-5 my-10 rounded-lg">
        <Form.Item
          name="campaignName"
          label="Campaign Name"
          initialValue={campaignDetails?.campaignName}
          rules={[
            {
              required: true,
              message: 'Please input campaign name',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Deploy when Approved" valuePropName="checked" name="deployWhenApproved">
          <Switch />
        </Form.Item>
        <Form.Item label="Deploy Period" name="Date">
          <DatePicker.RangePicker
            onCalendarChange={(dates, dateStrings, info) => {
              // console.log(dates);
              // console.log(dateStrings);
              // console.log(info);

              setCampaignStartDate(new Date(dateStrings[0]));
              setCampaignEndDate(new Date(dateStrings[1]));
            }}
          />
        </Form.Item>

        {/* Start from here @nathan */}
        <Form.Item label="Monthly Impression" name="monthlyImpressionTarget">
          <InputNumber
            min={20}
            value={chosenImpression}
            onChange={(value) => {
              // hook does not update with most updated value
              setChosenImpression(value);
            }}
          />
        </Form.Item>
        {/* End here @nathan */}

        <Alert message="Occupation preferences feature is coming soon!" type="info" className="my-5" />
        <Form.List
          name="preferences"
          rules={[]}
          initialValue={campaignDetails?.preferences?.length ? campaignDetails?.preferences : ['']}
        >
          {(fields, { add, remove }, { errors }) => {
            return (
              <>
                {fields.map((field, index) => {
                  // console.log("fields", field);
                  return (
                    <Form.Item
                      {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                      label={index === 0 ? 'Occupations' : ''}
                      required={false}
                      key={field.key}
                    >
                      <Form.Item
                        {...field}
                        validateTrigger={['onChange', 'onBlur']}
                        rules={[
                          {
                            required: true,
                            whitespace: true,
                            message: 'Please input occupation preference or delete this field.',
                          },
                        ]}
                        noStyle
                      >
                        <Input
                          placeholder="Occupation preference (e.g. student)"
                          style={{
                            width: '60%',
                          }}
                        />
                      </Form.Item>
                      {fields.length > 0 ? (
                        <MinusCircleOutlined className="dynamic-delete-button" onClick={() => remove(field.name)} />
                      ) : null}
                    </Form.Item>
                  );
                })}
                <Form.Item
                  wrapperCol={{
                    span: 12,
                    offset: 3,
                  }}
                >
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    style={{
                      width: '30%',
                    }}
                    icon={<PlusOutlined />}
                  >
                    Add Occupation
                  </Button>
                  <Form.ErrorList errors={errors} />
                </Form.Item>
              </>
            );
          }}
        </Form.List>
        <Form.Item
          wrapperCol={{
            span: 12,
            offset: 3,
          }}
        >
          <Button type="primary" htmlType="submit">
            Save
          </Button>
        </Form.Item>
      </Form>
      <Typography.Title className="text-center" level={3}>
        {`Your price is estimated to be SG$${
          Math.round(
            dateDifferenceInDays(campaignStartDate, campaignEndDate) *
              Number(process.env.NEXT_PUBLIC_COST_PER_MINUTE) *
              payload.totalDuration *
              (chosenImpression / 30) *
              100,
          ) / 100
        }`}
      </Typography.Title>
    </>
  );
}
export default CampaignDetailsForm;
