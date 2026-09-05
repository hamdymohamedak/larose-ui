import { LaRoseProvider } from '@larose-ui/runtime-react';
import { Card} from '@larose-ui/react';

function CardDemo() {

  return (
    <Card title='hello world'>
      {/* <Input label='name' placeholder='enter your name' /> */}
      {/* <Button variant='primary'> save</Button> */}
    </Card>
  );
}

export function CardScenario() {
  return (
    <LaRoseProvider theme="light" locale="en" tenantId="sandbox">
        <CardDemo />
    </LaRoseProvider>
  );
}
