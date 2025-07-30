import StatusBadge from './src/components/admin/StatusBadge';

// Test component to isolate StatusBadge issues
const TestStatusBadge = () => {
  return (
    <div>
      <h1>StatusBadge Tests</h1>
      <div>
        <p>Valid status:</p>
        <StatusBadge status="pending" variant="parcel" />
      </div>
      <div>
        <p>Null status:</p>
        <StatusBadge status={null} variant="parcel" />
      </div>
      <div>
        <p>Undefined status:</p>
        <StatusBadge status={undefined} variant="parcel" />
      </div>
      <div>
        <p>Number status:</p>
        <StatusBadge status={123} variant="parcel" />
      </div>
    </div>
  );
};

export default TestStatusBadge;
