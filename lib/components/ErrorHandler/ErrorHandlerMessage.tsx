import { Card, CardBody } from '@heroui/react';
import { Spinner } from '@heroui/react';

interface ErrorMessageProps {
  errorMessage?: string;
}
const ErrorHandlerMessage = ({ errorMessage }: ErrorMessageProps) => {
  return (
    <Card className="flex items-center justify-center">
      <CardBody>
        <p className="text-danger-400">{errorMessage}</p>
        <Spinner color="danger" />
      </CardBody>
    </Card>
  );
};

export default ErrorHandlerMessage;
