interface Props {
  label: string;
  count: number;
}

const ProfileCount = ({ label, count }: Props) => {
  return (
    <div className="flex flex-col items-center">
      <p className="text-lg text-muted-foreground font-semibold">{count}</p>
      <p className="text-sm font-semibold">{label}</p>
    </div>
  );
};

export default ProfileCount;
