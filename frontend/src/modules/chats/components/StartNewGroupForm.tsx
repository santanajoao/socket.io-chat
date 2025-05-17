import { Button } from "@/modules/shared/components/ui/button";
import { Form, FormField, FormItem, FormLabel } from "@/modules/shared/components/ui/form";
import { Input } from "@/modules/shared/components/ui/input";
import { useForm } from "react-hook-form";

type Props = {
  onClose: () => void;
}

export function StartNewGroupForm(props: Props) {
  const groupForm = useForm({
    defaultValues: {
      groupName: "",
    },
  });

  return (
    <Form {...groupForm}>
      <form className="flex flex-col gap-2">
        <FormField
          control={groupForm.control}
          name="groupName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Group name</FormLabel>
              <Input type="text" placeholder="Football guys" {...field} />
            </FormItem>
          )}
        />

        <Button type="submit" size="lg">Create group</Button>
      </form>
    </Form>
  );
}
