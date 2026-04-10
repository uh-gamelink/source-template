import * as Yup from 'yup';

export const AddGameAdminSchema = Yup.object({
  title: Yup.string().required('Title is required'),
  developer: Yup.string().required('Developer is required'),
  platform: Yup.string().nullable(),
  tags: Yup.string().required('Tags are required'),
  description: Yup.string().nullable(),
  imageUrl: Yup.string().nullable(),
});

export const EditGameAdminSchema = Yup.object({
  id: Yup.number().required(),
  title: Yup.string().required('Title is required'),
  developer: Yup.string().required('Developer is required'),
  platform: Yup.string().nullable(),
  tags: Yup.string().required('Tags are required'),
  description: Yup.string().nullable(),
  imageUrl: Yup.string().nullable(),
});