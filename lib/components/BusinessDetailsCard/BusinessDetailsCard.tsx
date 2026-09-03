'use client';

import {
  Button,
  Card,
  CardBody,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  useDisclosure,
} from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Input } from 'antd';

import { useAddBusinessDetails } from '@/lib/hooks/use-businessDetails';
import { useToast } from '@/lib/components/Toast/ToastContext';
import { IBusinessDetails } from '@/lib/interfaces/business-details.interface';
import {
  businessEntityTypes,
  industries,
  turnoverRanges,
} from '@/lib/constants/BusinessDetails/BusinessDetails';
import { safeAny } from '@/lib/interfaces/global.interface';

const formSchema = z.object({
  businessEntityType: z.number().min(1, 'Please select a business entity type'),
  businessName: z.string().min(1, 'Business name is required').max(100),
  designation: z.string().min(1, 'Designation is required'),
  turnover: z.number().min(1, 'Please select turnover range'),
  industry: z.number().min(1, 'Please select an industry'),
});

interface BusinessDetailsCardProps {
  businessDetails?: safeAny;
  onUpdate: () => void;
  showEnterDetails?: boolean;
}

export default function BusinessDetails({
  businessDetails,
  // onUpdate,
  showEnterDetails,
}: BusinessDetailsCardProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { mutateAsync: addBusinessDetails } = useAddBusinessDetails();
  const { showToast } = useToast();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessEntityType: 0,
      businessName: '',
      designation: '',
      turnover: 0,
      industry: 0,
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const businessData: IBusinessDetails = {
        businessEntityType: Number(data.businessEntityType),
        businessName: data.businessName,
        designation: data.designation,
        turnover: Number(data.turnover),
        industry: Number(data.industry),
      };

      const [response, error] = await addBusinessDetails(businessData);
      if (response && !error) {
        showToast('Business Details Added Successfully', 'success');
      } else {
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          'Something went wrong';
        showToast(errorMessage, 'error');
      }
    } catch (error) {
      console.error(error);
    }
    onClose();
  };

  if (showEnterDetails) {
    return (
      <>
        <Card className="p-6">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <h2 className="text-2xl font-semibold">
              Complete Your Merchant Business details
            </h2>
            <p className="text-gray-600">
              Set up your business profile to start accepting payments
            </p>
            <Button
              color="primary"
              size="lg"
              onPress={onOpen}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6"
            >
              Enter Business Details
            </Button>
          </div>
        </Card>

        <BusinessDetailsModal
          isOpen={isOpen}
          onClose={onClose}
          onSubmit={onSubmit}
          form={form}
        />
      </>
    );
  }

  return (
    <div className="flex flex-col gap-4 mx-auto my-8 w-full">
      <Card className="bg-white dark:bg-default-100 rounded-lg shadow-lg">
        <CardBody className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between mb-6">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="flex gap-4">
                <InfoItem
                  label="Business Name"
                  value={businessDetails?.businessName}
                />
              </div>
            </div>

            <Button
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6"
              size="lg"
              onPress={onOpen}
            >
              Update Business Details
            </Button>
          </div>

          <Divider className="my-4 bg-purple-500" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoItem
              label="Designation"
              value={businessDetails?.designation}
            />
            <InfoItem
              label="Business Entity Type"
              value={
                businessEntityTypes.find(
                  (item) => item.key === businessDetails?.businessEntityType,
                )?.label || '-'
              }
            />
            <InfoItem
              label="Turnover"
              value={
                turnoverRanges.find(
                  (item) => item.key === businessDetails?.turnover,
                )?.label || '-'
              }
            />
            <InfoItem
              label="Industry"
              value={
                industries.find(
                  (item) => item.key === businessDetails?.industry,
                )?.label || '-'
              }
            />
          </div>
        </CardBody>
      </Card>

      <BusinessDetailsModal
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={onSubmit}
        form={form}
      />
    </div>
  );
}

const InfoItem = ({ label, value }: { label: string; value: string }) => (
  <div className="mb-2">
    <span className="font-semibold">{label}:</span> {value}
  </div>
);

const BusinessDetailsModal = ({
  isOpen,
  onClose,
  onSubmit,
  form,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: z.infer<typeof formSchema>) => void;
  form: safeAny;
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <ModalHeader>Merchant Onboarding</ModalHeader>
          <ModalBody className="gap-4">
            {/* <Select
              label="Business Entity Type"
              placeholder="Select business type"
              {...form.register('businessEntityType', { valueAsNumber: true })}
              // errorMessage={form.formState.errors.businessEntityType?.message}
              // isInvalid={!!form.formState.errors.businessEntityType}
            >
              {businessEntityTypes.map((type) => (
                <SelectItem key={type.key} value={type.key}>
                  {type.label}
                </SelectItem>
              ))}
            </Select> */}

            <div>
              <label className="block text-sm mb-1">Business Name</label>
              <Input
                placeholder="Enter your business name"
                {...form.register('businessName')}
                status={
                  form.formState.errors.businessName ? 'error' : undefined
                }
              />
              {form.formState.errors.businessName && (
                <div className="text-red-500 text-sm mt-1">
                  {form.formState.errors.businessName.message}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm mb-1">Designation</label>
              <Input
                placeholder="Enter your designation"
                {...form.register('designation')}
                status={form.formState.errors.designation ? 'error' : undefined}
              />
              {form.formState.errors.designation && (
                <div className="text-red-500 text-sm mt-1">
                  {form.formState.errors.designation.message}
                </div>
              )}
            </div>

            {/* <Select
              label="Annual Turnover"
              placeholder="Select turnover range"
              {...form.register('turnover', { valueAsNumber: true })}
              // errorMessage={form.formState.errors.turnover?.message}
              // isInvalid={!!form.formState.errors.turnover}
            >
              {turnoverRanges.map((range) => (
                <SelectItem key={range.key} value={range.key}>
                  {range.label}
                </SelectItem>
              ))}
            </Select> */}

            {/* <Select
              label="Industry"
              placeholder="Select your industry"
              {...form.register('industry', { valueAsNumber: true })}
              // errorMessage={form.formState.errors.industry?.message}
              // isInvalid={!!form.formState.errors.industry}
            >
              {industries.map((industry) => (
                <SelectItem key={industry.key} value={industry.key}>
                  {industry.label}
                </SelectItem>
              ))}
            </Select> */}
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Cancel
            </Button>
            <Button
              color="primary"
              className="bg-purple-600"
              onClick={() => {
                const values = form.getValues();
                onSubmit(values);
              }}
            >
              Submit
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};
