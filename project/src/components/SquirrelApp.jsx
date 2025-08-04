import { useState, useEffect } from 'react'
import { Button, Form, Input, Card, List, Typography, Space, Modal, message } from 'antd'
import { PlusOutlined, EnvironmentOutlined, EyeOutlined } from '@ant-design/icons'
import { Squirrel } from '../entities/Squirrel'

const { Title, Text } = Typography
const { TextArea } = Input

function SquirrelApp() {
  const [squirrels, setSquirrels] = useState([])
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()
  const [isModalVisible, setIsModalVisible] = useState(false)

  useEffect(() => {
    loadSquirrels()
  }, [])

  const loadSquirrels = async () => {
    setLoading(true)
    try {
      const response = await Squirrel.list()
      if (response.success) {
        setSquirrels(response.data || [])
      }
    } catch (error) {
      message.error('Failed to load squirrels')
    } finally {
      setLoading(false)
    }
  }

  const onFinish = async (values) => {
    try {
      const squirrelData = {
        ...values,
        dateSpotted: new Date().toISOString().split('T')[0]
      }
      
      const response = await Squirrel.create(squirrelData)
      if (response.success) {
        message.success('Squirrel added successfully!')
        form.resetFields()
        setIsModalVisible(false)
        loadSquirrels()
      }
    } catch (error) {
      message.error('Failed to add squirrel')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <Title level={1} className="text-green-700 mb-2">
            🐿️ Neighborhood Squirrel Registry
          </Title>
          <Text className="text-lg text-gray-600">
            Keep track of all the squirrels in your neighborhood!
          </Text>
        </div>

        <div className="mb-6 text-center">
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={() => setIsModalVisible(true)}
            className="bg-green-600 hover:bg-green-700 border-green-600"
          >
            Add New Squirrel
          </Button>
        </div>

        <Modal
          title="Add New Squirrel"
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
          width={600}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            className="mt-4"
          >
            <Form.Item
              name="name"
              label="Squirrel Name"
              rules={[{ required: true, message: 'Please enter a name for the squirrel!' }]}
            >
              <Input placeholder="e.g., Nutkin, Fluffy Tail, etc." size="large" />
            </Form.Item>

            <Form.Item
              name="description"
              label="Description"
              rules={[{ required: true, message: 'Please describe the squirrel!' }]}
            >
              <TextArea
                rows={4}
                placeholder="Describe the squirrel's appearance, behavior, or any distinguishing features..."
              />
            </Form.Item>

            <Form.Item
              name="location"
              label="Location Spotted"
              rules={[{ required: true, message: 'Please enter where you saw the squirrel!' }]}
            >
              <Input placeholder="e.g., Oak tree by the park bench, backyard feeder, etc." size="large" />
            </Form.Item>

            <Form.Item className="mb-0">
              <Space className="w-full justify-end">
                <Button onClick={() => setIsModalVisible(false)}>
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit" className="bg-green-600 border-green-600">
                  Add Squirrel
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {squirrels.map((squirrel) => (
            <Card
              key={squirrel._id}
              className="hover:shadow-lg transition-shadow duration-300 border-green-200"
              cover={
                <div className="bg-gradient-to-r from-green-100 to-amber-100 p-6 text-center">
                  <div className="text-6xl mb-2">🐿️</div>
                  <Title level={3} className="text-green-700 mb-0">
                    {squirrel.name}
                  </Title>
                </div>
              }
            >
              <div className="space-y-3">
                <div>
                  <Text strong className="text-gray-700">Description:</Text>
                  <p className="text-gray-600 mt-1">{squirrel.description}</p>
                </div>
                
                <div className="flex items-start space-x-2">
                  <EnvironmentOutlined className="text-green-600 mt-1" />
                  <div>
                    <Text strong className="text-gray-700">Location:</Text>
                    <p className="text-gray-600 mt-1">{squirrel.location}</p>
                  </div>
                </div>

                {squirrel.dateSpotted && (
                  <div className="flex items-center space-x-2">
                    <EyeOutlined className="text-amber-600" />
                    <Text className="text-gray-500">
                      First spotted: {new Date(squirrel.dateSpotted).toLocaleDateString()}
                    </Text>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        {squirrels.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-8xl mb-4">🐿️</div>
            <Title level={3} className="text-gray-500 mb-2">
              No squirrels spotted yet!
            </Title>
            <Text className="text-gray-400">
              Start by adding your first neighborhood squirrel friend.
            </Text>
          </div>
        )}
      </div>
    </div>
  )
}

export default SquirrelApp