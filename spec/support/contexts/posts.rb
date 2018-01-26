shared_context 'posts' do
  let!(:post_1) do
    FactoryBot.create(
      :post,
      title: 'Post 1 title',
      title_color: '#000000',
      description: 'Post 1 description',
      date: Time.now,
      highlighted: false,
      post_url: 'https://medium.com/trase/supporting-governments-to-help-eliminate-deforestation-from-international-commodity-trade-6a25348ae0c1',
      category: 'NEWS'
    )
  end
  let!(:post_2) do
    FactoryBot.create(
      :post,
      title: 'Post 2 title',
      title_color: '#000000',
      description: 'Post 2 description',
      date: Time.now,
      highlighted: false,
      post_url: 'https://medium.com/trase/supporting-governments-to-help-eliminate-deforestation-from-international-commodity-trade-6a25348ae0c1',
      category: 'BLOG'
    )
  end
  let!(:post_3) do
    FactoryBot.create(
      :post,
      title: 'Post 3 title',
      title_color: '#000000',
      description: 'Post 3 description',
      date: Time.now,
      highlighted: false,
      post_url: 'https://medium.com/trase/supporting-governments-to-help-eliminate-deforestation-from-international-commodity-trade-6a25348ae0c1',
      category: 'INSIGHT'
    )
  end
end
