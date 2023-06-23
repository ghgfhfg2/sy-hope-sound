import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Flex, Input, Select, FormControl } from "@chakra-ui/react";
import axios from "axios";

export default function WorkInfo() {
  const { handleSubmit, register } = useForm();

  const [projectList, setProjectList] = useState();
  useEffect(() => {
    axios
      .post("https://shop.editt.co.kr/_var/_xml/groupware.php", {
        a: "get_project_list",
      })
      .then((res) => {
        setProjectList(res.data.project);
      });
  }, []);

  const onFilterProject = () => {};

  const onSubmit = (values) => {
    console.log(values);
  };

  return (
    <>
      {projectList && (
        <Select onChange={onFilterProject} width={200} mr={3}>
          <option value="" key="-1">
            프로젝트 선택
          </option>
          {projectList.map((el) => (
            <option value={el.uid} key={el.uid}>
              {el.title}
            </option>
          ))}
        </Select>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Flex>
          <Input placeholder="항목" {...register("title")} />
          <Input placeholder="내용" {...register("info")} />
          <Button type="submit">추가</Button>
        </Flex>
      </form>
    </>
  );
}
